import pytest 
from Birds.models import Birds

@pytest.mark.django_db
def test_birds_creation():
    birds = Birds.objects.create(
        name = "Авдотка (Burhinus oedicnemus)",
        description = "Птица из семейства авдотковых. Занесена в Красную книгу России."
    )
    assert birds.name == "Авдотка (Burhinus oedicnemus)"
    assert birds.description == "Птица из семейства авдотковых. Занесена в Красную книгу России."


@pytest.mark.django_db
def test_birds_str():
    birds = Birds.objects.create(
        name = "Балобан (Falco cherrug)",
        description = "Вид хищных птиц семейства соколиных."
    )
    assert str(birds) == "Балобан (Falco cherrug)"


@pytest.mark.djando_db
def test_with_texture(create_product):
    birds = create_product(
        name = "Fixture Birds",
        description = "Test"
    )
    assert birds.name == "Fixture Birds"
    assert birds.name == "Test"


@pytest.mark.django_db
def test_update_birds():
    birds = birds.objects.create(
        name = "Степная пустельга",
        description = " Мелкая хищная птица семейства соколиных"
    )
    birds.name = "Степная тиркушка"
    assert birds.name == "Степная тиркушка"


@pytest.mark.django_db
def test_delete_birds():
    birds = birds.objects.create(
        name = "Дербник (Falco columbarius)",
        description = "Хищная птица, мелкий сокол."
    )
    birds_id = birds.id
    birds.delete()
    
    assert Birds.objects.filter(id = birds_id).count() == 0
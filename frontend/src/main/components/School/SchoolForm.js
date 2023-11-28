import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function SchoolForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // Stryker disable next-line Regex
    const abbrev_regex = /^([a-z._])+$/;

    return (

        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="abbrev">Abbreviation</Form.Label>
                        <Form.Control
                            data-testid="SchoolForm-abbrev"
                            id="abbrev"
                            type="text"
                            isInvalid={Boolean(errors.abbrev)}
                            {...register("abbrev", { required: true, pattern: abbrev_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.abbrev?.type === 'required' && 'Abbreviation is required. '}
                            {errors.abbrev?.type === 'pattern' && 'Abbreviation must be lowercase letters (_ and . allowed), e.g. ucsb'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="name">Name</Form.Label>
                        <Form.Control
                            data-testid="SchoolForm-name"
                            id="name"
                            type="text"
                            isInvalid={Boolean(errors.name)}
                            {...register("name", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name && 'Name is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="termRegex">Term Regex</Form.Label>
                        <Form.Control
                            data-testid="SchoolForm-termRegex"
                            id="termRegex"
                            type="text"
                            isInvalid={Boolean(errors.termRegex)}
                            {...register("termRegex", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.termRegex && 'Term Regex is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="termDescription">Term Description</Form.Label>
                        <Form.Control
                            data-testid="SchoolForm-termDescription"
                            id="termDescription"
                            type="text"
                            isInvalid={Boolean(errors.termDescription)}
                            {...register("termDescription", { required: true})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.termDescription && 'Term Description is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="termError">Term Error</Form.Label>
                        <Form.Control
                            data-testid="SchoolForm-termError"
                            id="termError"
                            type="text"
                            isInvalid={Boolean(errors.termError)}
                            {...register("termError", { required: true})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.termError && 'Term Error is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="SchoolForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="SchoolForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default SchoolForm;
